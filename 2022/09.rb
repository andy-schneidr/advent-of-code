module Day09
  class << self
    def part_one(input)
      rope = Rope.new(1, 0)
      input.each do |line|
        parts = line.split(' ')
        (parts[1].to_i).times { rope.update_head(parts[0]) }
      end
      rope.baby.visited.keys.count
    end

    def part_two(input)
      rope = Rope.new(9, 0)
      input.each do |line|
        parts = line.split(' ')
        (parts[1].to_i).times { rope.update_head(parts[0]) }
      end

      baby = rope
      while baby.baby != nil do
        baby = baby.baby
      end
      baby.visited.keys.count
    end
  end

  class Rope

    attr_accessor :head
    attr_accessor :baby
    attr_accessor :visited

    X = 0
    Y = 1
    def initialize(babies, num)
      @head = [0,0]
      @visited = Hash.new
      @visited.store(@head, 1)

      if babies > 0
        @baby = Rope.new(babies - 1, num + 1)
      end

    end

    def update_head(dir)
      case dir
      when "U"
        @head[Y] += 1
      when "D"
        @head[Y] -= 1
      when "R"
        @head[X] += 1
      when "L"
        @head[X] -= 1
      end
      @visited.store(@head, 1)
      if @baby != nil
        @baby.update_as_tail(@head)
      end
    end

    def update_as_tail(parent_pos)
      # Find where the tail needs to move
      if @head[X] == parent_pos[X]
        if @head[Y] < parent_pos[Y] - 1
          @head[Y] = parent_pos[Y] - 1
        elsif @head[Y] > parent_pos[Y] + 1
          @head[Y] = parent_pos[Y] + 1
        end
      elsif @head[Y] == parent_pos[Y]
        if @head[X] < parent_pos[X] - 1
          @head[X] = parent_pos[X] - 1
        elsif @head[X] > parent_pos[X] + 1
          @head[X] = parent_pos[X] + 1
        end
      # Need to move diagonally?
      elsif (parent_pos[X] - @head[X]).abs + (parent_pos[Y] - @head[Y]).abs > 2
        @head[X] += (parent_pos[X] - @head[X]) < 0 ? -1 : 1
        @head[Y] += (parent_pos[Y] - @head[Y]) < 0 ? -1 : 1
      end

      @visited.store(@head, 1)
      if @baby != nil
        @baby.update_as_tail(@head)
      end
    end
  end
end

lines = File.readlines("examples/09/091.txt")
puts Day09.part_one(lines)
puts Day09.part_two(lines)
lines = File.readlines("examples/09/092.txt")
puts Day09.part_two(lines)
lines = File.readlines("inputs/09.txt")
puts Day09.part_one(lines)
puts Day09.part_two(lines)
