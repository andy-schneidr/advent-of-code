module Day08
  class << self
    @max = 9
    def part_one(input)
      width = input[0].length-1
      depth = input.length
      visible = Array.new(depth){Array.new(width, 0)}

      0.step(depth-1, 1) { |r|
        visible = check_row(input, visible, r)
      }
      0.step(width-1, 1) { |c|
        visible = check_col(input, visible, c)
      }
      visible.flatten.inject(:+)
    end

    def part_two(input)
      best_score = 0
      0.step(input.length-1, 1) { |row|
        0.step(input[row].strip.length-1, 1) { |col|
          score = check_score(input, row, col)
          if score > best_score
            best_score = score
          end
        }
      }
      best_score
    end

    def check_score(input, row, col)
      dn = check_dn(input, row, col)
      up = check_up(input, row, col)
      lf = check_lf(input, row, col)
      rt = check_rt(input, row, col)
      return (dn * up * lf * rt)
    end

    def check_dn(input, row, col)
      base = -1
      max = input[row][col].to_i
      fin = input.length-1
      dir = 1
      sum = 0
      start = row + 1
      start.step(fin, dir) { |row|
        sum += 1
        tree = input[row][col].to_i
        if tree > base
          base = tree
        end
        break if base >= max
      }
      sum
    end
    def check_up(input, row, col)
      base = -1
      max = input[row][col].to_i
      fin = 0
      dir = -1
      sum = 0
      start = row - 1
      start.step(fin, dir) { |row|
        sum += 1
        tree = input[row][col].to_i
        if tree > base
          base = tree
        end
        break if base >= max
      }
      sum
    end
    def check_lf(input, row, col)
      base = -1
      max = input[row][col].to_i
      fin = 0
      dir = -1
      sum = 0
      start = col - 1
      start.step(fin, dir) { |col|
        sum += 1
        tree = input[row][col].to_i
        if tree > base
          base = tree
        end
        break if base >= max
      }
      sum
    end
    def check_rt(input, row, col)
      base = -1
      max = input[row][col].to_i
      fin = input[row].strip.length-1
      dir = 1
      sum = 0
      start = col + 1
      start.step(fin, dir) { |col|
        sum += 1
        tree = input[row][col].to_i
        if tree > base
          base = tree
        end
        break if base >= max
      }
      sum
    end

    def check_row(input, visible, row)
      visible = check_row_left_to_right(input, visible, row)
      visible = check_row_right_to_left(input, visible, row)
      visible
    end

    def check_row_left_to_right(input, visible, row)
      dir = 1
      fin = input[row].strip.length-1
      start = 0
      base = -1
      start.step(fin, dir) { |col|
        val = input[row][col].to_i
        if val > base
          visible[row][col] = 1
          base = val
        end
        break if base == @max
      }
      visible
    end

    def check_row_right_to_left(input, visible, row)
      dir = -1
      fin = 0
      start = input[row].strip.length-1
      base = -1
      start.step(fin, dir) { |col|
        val = input[row][col].to_i
        if val > base
          visible[row][col] = 1
          base = val
        end
        break if base == @max
      }
      visible
    end

    def check_col(input, visible, col)
      visible = check_col_top_to_bottom(input, visible, col)
      visible = check_col_bottom_to_top(input, visible, col)
      visible
    end

    def check_col_top_to_bottom(input, visible, col)
      dir = 1
      fin = input.length-1
      start = 0
      base = -1
      start.step(fin, dir) { |row|
        val = input[row][col].to_i
        if val > base
          visible[row][col] = 1
          base = val
        end
        break if base == @max
      }
      visible
    end

    def check_col_bottom_to_top(input, visible, col)
      dir = -1
      fin = 0
      start = input.length-1
      base = -1
      start.step(fin, dir) { |row|
        val = input[row][col].to_i
        if val > base
          visible[row][col] = 1
          base = val
        end
        break if base == @max
      }
      visible
    end
  end
end

lines = File.readlines("examples/08/08.txt")
puts Day08.part_one(lines)
puts Day08.part_two(lines)
lines = File.readlines("inputs/08.txt")
# puts Day08.part_one(lines)
puts Day08.part_two(lines)
