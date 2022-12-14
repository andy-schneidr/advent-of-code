module Day14
  class << self
    def part_one(input)
      @part_two = false
      map = Array.new(200) { Array.new(600, ".") }
      insert_rocks(input, map)
      print_map(map)
      insert_sands(map)
    end

    def part_two(input)
      @part_two = true
      map = Array.new(200) { Array.new(1000, ".") }
      insert_rocks(input, map)
      print_map(map)
      insert_sands(map)
    end

    def insert_rocks(input, map)
      x = 0
      y = 1
      pos_lists = []
      input.each do |line|
        pos_lists.append(parse_line(line))
      end
      if @part_two
        highest_y = 0
        pos_lists.each do |pos_list|
          pos_list.each do |position|
            if position[y] > highest_y
              highest_y = position[y]
            end
          end
        end
        pos_lists.append([[0, highest_y + 2], [999, highest_y + 2]])
      end

      pos_lists.each do |positions|
        position = positions[0]
        i = 1
        while i < positions.length
          next_pos = positions[i]
          while position[x] != next_pos[x] || position[y] != next_pos[y]
            map[position[y]][position[x]] = "#"
            # Assume only one of the following will be true at once
            if position[x] > next_pos[x]
              position[x] -= 1
            elsif position[x] < next_pos[x]
              position[x] += 1
            elsif position[y] > next_pos[y]
              position[y] -= 1
            elsif position[y] < next_pos[y]
              position[y] += 1
            end
          end
          map[position[y]][position[x]] = "#"
          position = positions[i]
          i += 1
        end
      end
    end

    def parse_line(line)
      raw_pairs = line.strip.split(" -> ")
      pairs = []
      raw_pairs.each do |pair|
        pairs.append(pair.split(",").map!(&:to_i))
      end
      pairs
    end

    def print_map(map)
      map.each do |line|
        puts line[200..700].join("")
      end
    end

    def insert_sands(map)
      sands = 0
      while insert_sand(map)
        sands += 1
      end
      print_map(map)
      sands
    end

    def insert_sand(map)
      y = 0
      x = 1
      sand = "o"
      rock = "#"
      empty = "."
      sand_pos = [0, 500]
      if map[sand_pos[y]][sand_pos[x]] == sand
        return false
      end
      map[sand_pos[y]][sand_pos[x]] = sand
      while sand_pos[y] < map.length - 1
        if map[sand_pos[y] + 1][sand_pos[x]] != rock &&
           map[sand_pos[y] + 1][sand_pos[x]] != sand
          # if sand can move down, move down
          map[sand_pos[y]][sand_pos[x]] = empty
          sand_pos[y] += 1
          map[sand_pos[y]][sand_pos[x]] = sand
        elsif map[sand_pos[y] + 1][sand_pos[x] - 1] != rock &&
              map[sand_pos[y] + 1][sand_pos[x] - 1] != sand
          # if sand can move bottom left, move there
          map[sand_pos[y]][sand_pos[x]] = empty
          sand_pos[y] += 1
          sand_pos[x] -= 1
          map[sand_pos[y]][sand_pos[x]] = sand
        elsif map[sand_pos[y] + 1][sand_pos[x] + 1] != rock &&
              map[sand_pos[y] + 1][sand_pos[x] + 1] != sand
          # if sand can move bottom right, move there
          map[sand_pos[y]][sand_pos[x]] = empty
          sand_pos[y] += 1
          sand_pos[x] += 1
          map[sand_pos[y]][sand_pos[x]] = sand
        else
          return true
        end
      end
      return false
    end
  end
end

lines = File.readlines("examples/14/14.txt")
# puts Day14.part_one(lines)
# puts Day14.part_two(lines)
lines = File.readlines("inputs/14.txt")
# puts Day14.part_one(lines)
puts Day14.part_two(lines)
